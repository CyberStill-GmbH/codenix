export function toAuthUser(user) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        degree: user.degree,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        memberSince: user.createdAt.toISOString(),
        role: user.role
    };
}
//# sourceMappingURL=auth.mapper.js.map