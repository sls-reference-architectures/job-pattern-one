# job-pattern-one

Job pattern to demonstrate how to de-couple a potentially long-running action from the user requesting that action.

In our example, let's use a trivial example of translating a text phrase. The user submits a phrase and receives a Job `id`. She can use that `id` to see the status of her job (Pending/Complete/Failed) and get the results.

In the real world, this job may do some complicated/time-consuming OCR, file manipulation, data aggregation, etc.

## Authorization

The HTTP API is protected with IAM authorization (`authorizer: type: aws_iam`),
so every request must be SigV4-signed by a caller holding `execute-api:Invoke`
on the endpoint. Without this, anyone could start Step Functions executions.
