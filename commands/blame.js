let blame = async (message) => {
    const members = await message.channel.members;
    const randomMember = members.random();

    if (randomMember) {
        message.channel.send(`It's all ${randomMember}'s fault!`);
    }
}

export { blame }
