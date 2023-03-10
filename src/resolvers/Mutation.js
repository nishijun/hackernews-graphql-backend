const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET } = require('../utils')

async function signup(parent, args, context) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({
        data: {
            ...args,
            password,
        },
    })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return { token, user }
}

async function login(parent, args, context) {
    const user = await context.prisma.user.findUnique({
        where: { email: args.email },
    })
    if (!user) {
        throw new Error('there is no such user.')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!user) {
        throw new Error('invalid password.')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return { token, user }
}

async function post(parent, args, context) {
    const { userId } = context
    return await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            User: {connect: {id: userId}},
        }
    })
}

module.exports = {
    signup,
    login,
    post,
}