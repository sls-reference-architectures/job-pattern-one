# job-pattern-one

Job pattern to demonstrate how to de-couple a potentially long-running action from the user requesting that action.

In our example, let's use a trivial example of translating a text phrase. The user submits a phrase and receives a Job `id`. She can use that `id` to see the status of her job (Pending/Complete/Failed) and get the results.

In the real world, this job may do some complicated/time-consuming OCR, file manipulation, data aggregation, etc.

## Authorization

The HTTP API is protected with IAM authorization (`authorizer: type: aws_iam`),
so every request must be SigV4-signed by a caller holding `execute-api:Invoke`
on the endpoint. Without this, anyone could start Step Functions executions.

## Failure handling

**Duplicate notifications are harmless.** EventBridge and Lambda retries deliver at least once, so the
translate workflow can start twice for one job. The duplicate's first step fails the revision
check with `ConflictError` and ends in the `Job Already Started` success state, without retrying
and without touching the job. Consumers of `update` events should order them by `revision`,
because EventBridge doesn't guarantee delivery order.

**Failures are bounded and visible.** Each queue keeps messages for 14 days and has a CloudWatch
alarm. The alarms have no notification target; wire one up per environment.

- **Stream consumer** (`onDbStreamEvent`):
  - splits a failing batch to isolate the bad record;
  - retries 5 times and gives up on records older than 1 hour;
  - sends what still fails to `job-pattern-one-on-db-stream-event-failures`. Those messages hold the
    shard and sequence numbers, so re-read the stream within its 24 h retention.
- **`onJobCreated`:**
  - events EventBridge can't deliver (retried for up to 1 hour), and invocations that still fail
    after Lambda's 2 async retries, both go to `job-pattern-one-on-job-created-failures`;
  - jobs named there are stuck in `Pending`.

The Rust sibling, `job-pattern-one-rust`, has the same failure handling. Its acceptance suite
(`STACK_NAME=job-pattern-one-dev`) checks this stack's behavior too.
