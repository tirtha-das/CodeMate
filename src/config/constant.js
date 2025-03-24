const PHOTOURL_END_REGEX = /\.(jpeg|jpg|png|gif|webp|svg)$/i
const GENDER_POSSIBLE_VALUE=["male","female","other"];
const USER_SAFE_DATA = "firstName lastName age gender photoURL about isOnline"



module.exports = {
    PHOTOURL_END_REGEX,
    GENDER_POSSIBLE_VALUE,
    USER_SAFE_DATA
}