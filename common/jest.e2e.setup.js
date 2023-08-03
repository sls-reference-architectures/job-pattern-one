// eslint-disable-next-line import/no-extraneous-dependencies
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';

const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';

const setup = async () => {
  const projectName = 'job-pattern-one';
  const stackName = `${projectName}-${stage}`;
  const stack = await getStack(stackName);
  process.env.API_URL = getApiUrl(stack);
  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.TABLE_NAME = projectName;
};

const getApiUrl = (stack) => stack.Outputs?.find((o) => o.OutputKey === 'HttpApiUrl')?.OutputValue;
const getStack = async (stackName) => {
  const cf = new CloudFormationClient({ region });
  const stackResult = await cf.send(
    new DescribeStacksCommand({
      StackName: stackName,
    }),
  );
  const stack = stackResult.Stacks?.[0];
  if (!stack) {
    throw new Error(`Could not find CFN stack with name ${stackName}`);
  }

  return stack;
};

export default setup;
