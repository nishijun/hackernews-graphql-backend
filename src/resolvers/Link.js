function userId(parent, args, context) {
    return context.prisma.link.findUnique({
        where: {id: parent.id}
    }).userId()
}

module.exports = { userId }