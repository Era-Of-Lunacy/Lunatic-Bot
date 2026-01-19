CREATE TABLE guilds (
    id BIGINT PRIMARY KEY,
    moderators BIGINT[] NOT NULL DEFAULT '{}'
);
