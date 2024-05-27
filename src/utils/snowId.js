import SnowflakeId from "snowflake-id";
export const snowflake = new SnowflakeId({
    mid: 42,
    offset: (2019 - 1970) * 31536000 * 1000
});
