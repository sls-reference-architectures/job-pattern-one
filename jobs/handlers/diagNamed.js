exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ version: process.version, arch: process.arch }),
});
