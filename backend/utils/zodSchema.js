const { z } = require('zod');

const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    cPassword: z.string().min(8),
});

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

const resetPasswordSchema = z.object({
    password: z.string().min(8),
    cPassword: z.string().min(8),
});

module.exports = {
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
