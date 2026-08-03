const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// 저장된 회원 목록
export const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);

    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("회원정보를 불러오지 못했습니다.", error);
    return [];
  }
};

// 회원가입
export const signup = ({ username, nickname, password }) => {
  const users = getUsers();

  const normalizedUsername = username.trim();
  const normalizedNickname = nickname.trim();

  const usernameExists = users.some(
    (user) => user.username === normalizedUsername,
  );

  if (usernameExists) {
    throw new Error("이미 존재하는 아이디입니다.");
  }

  const nicknameExists = users.some(
    (user) => user.nickname === normalizedNickname,
  );

  if (nicknameExists) {
    throw new Error("이미 사용 중인 닉네임입니다.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    username: normalizedUsername,
    nickname: normalizedNickname,
    password,
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

  return newUser;
};

// 로그인
export const login = ({ username, password }) => {
  const users = getUsers();

  const user = users.find(
    (item) => item.username === username.trim() && item.password === password,
  );

  if (!user) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const currentUser = {
    id: user.id,
    username: user.username,

    // 기존 회원 데이터에 nickname이 없으면 username을 대신 사용
    nickname: user.nickname || user.username,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  return currentUser;
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// 현재 로그인한 사용자
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("로그인 정보를 불러오지 못했습니다.", error);
    return null;
  }
};

// 로그인 여부
export const isLoggedIn = () => {
  return Boolean(getCurrentUser());
};
