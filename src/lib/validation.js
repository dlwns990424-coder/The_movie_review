// 아이디
export const USERNAME_REGEX = /^[a-z0-9]{4,20}$/;

// 닉네임
export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;

// 비밀번호
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
