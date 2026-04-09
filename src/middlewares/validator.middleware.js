export const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const issues = error?.issues ?? error?.errors;
    if (issues) {
      return res.status(400).json(issues.map((issue) => issue.message));
    }
    return res.status(400).json([error.message]);
  }
};