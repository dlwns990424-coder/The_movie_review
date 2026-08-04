import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { signup } from "../../lib/authStorage";
import {
  USERNAME_REGEX,
  NICKNAME_REGEX,
  PASSWORD_REGEX,
} from "../../lib/validation";

import PageTitle from "../components/common/PageTitle";

function ValidationMessage({ isValid, children }) {
  return (
    <p
      className={`mt-2 flex items-center gap-1.5 text-xs ${
        isValid ? "text-green-400" : "text-white/40"
      }`}
    >
      {isValid ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <X size={14} strokeWidth={2.5} />
      )}

      <span>{children}</span>
    </p>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const trimmedUsername = username.trim();
  const trimmedNickname = nickname.trim();

  const isUsernameValid = USERNAME_REGEX.test(trimmedUsername);
  const isNicknameValid = NICKNAME_REGEX.test(trimmedNickname);

  const hasPasswordLetter = /[A-Za-z]/.test(password);
  const hasPasswordNumber = /\d/.test(password);
  const hasPasswordSpecial = /[!@#$%^&*]/.test(password);
  const hasPasswordLength = password.length >= 8 && password.length <= 20;

  const isPasswordValid = PASSWORD_REGEX.test(password);

  const isPasswordCheckValid =
    passwordCheck.length > 0 && password === passwordCheck;

  const isFormValid =
    isUsernameValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordCheckValid;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("입력 조건을 모두 확인해주세요.");
      return;
    }

    try {
      signup({
        username: trimmedUsername,
        nickname: trimmedNickname,
        password,
      });

      toast.success("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageTitle title="회원가입" />

      <main className="flex min-h-screen items-center justify-center bg-black px-5 py-12">
        <div className="w-full max-w-[440px]">
          <Link
            to="/"
            aria-label="THE MOVIE 홈으로 이동"
            className="mb-8 block text-center"
          >
            <span className="text-[30px] font-bold text-[#33ddff] transition hover:opacity-80 md:text-[38px]">
              THE MOVIE
            </span>
          </Link>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
          >
            <h1 className="mb-2 text-center text-3xl font-bold text-white">
              회원가입
            </h1>

            <p className="mb-8 text-center text-sm text-white/50">
              계정을 만들고 콘텐츠를 찜하고 리뷰를 작성해보세요.
            </p>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  아이디
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력해주세요"
                  autoComplete="username"
                  maxLength={20}
                  className={`h-12 w-full rounded-lg border bg-black px-4 text-white outline-none transition placeholder:text-white/30 ${
                    username.length === 0
                      ? "border-white/20 focus:border-[#33ddff]"
                      : isUsernameValid
                        ? "border-green-400"
                        : "border-red-400"
                  }`}
                />

                <ValidationMessage isValid={isUsernameValid}>
                  영문 소문자와 숫자만 사용하여 4~20자로 입력
                </ValidationMessage>
              </div>

              <div>
                <label
                  htmlFor="nickname"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  닉네임
                </label>

                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력해주세요"
                  autoComplete="nickname"
                  maxLength={10}
                  className={`h-12 w-full rounded-lg border bg-black px-4 text-white outline-none transition placeholder:text-white/30 ${
                    nickname.length === 0
                      ? "border-white/20 focus:border-[#33ddff]"
                      : isNicknameValid
                        ? "border-green-400"
                        : "border-red-400"
                  }`}
                />

                <ValidationMessage isValid={isNicknameValid}>
                  한글, 영문, 숫자만 사용하여 2~10자로 입력
                </ValidationMessage>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  비밀번호
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="new-password"
                  maxLength={20}
                  className={`h-12 w-full rounded-lg border bg-black px-4 text-white outline-none transition placeholder:text-white/30 ${
                    password.length === 0
                      ? "border-white/20 focus:border-[#33ddff]"
                      : isPasswordValid
                        ? "border-green-400"
                        : "border-red-400"
                  }`}
                />

                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                  <ValidationMessage isValid={hasPasswordLetter}>
                    영문 포함
                  </ValidationMessage>

                  <ValidationMessage isValid={hasPasswordNumber}>
                    숫자 포함
                  </ValidationMessage>

                  <ValidationMessage isValid={hasPasswordSpecial}>
                    특수문자 포함
                  </ValidationMessage>

                  <ValidationMessage isValid={hasPasswordLength}>
                    8~20자
                  </ValidationMessage>
                </div>
              </div>

              <div>
                <label
                  htmlFor="passwordCheck"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  비밀번호 확인
                </label>

                <input
                  id="passwordCheck"
                  type="password"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  autoComplete="new-password"
                  maxLength={20}
                  className={`h-12 w-full rounded-lg border bg-black px-4 text-white outline-none transition placeholder:text-white/30 ${
                    passwordCheck.length === 0
                      ? "border-white/20 focus:border-[#33ddff]"
                      : isPasswordCheckValid
                        ? "border-green-400"
                        : "border-red-400"
                  }`}
                />

                {passwordCheck.length > 0 && (
                  <p
                    className={`mt-2 flex items-center gap-1.5 text-xs ${
                      isPasswordCheckValid ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPasswordCheckValid ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      <X size={14} strokeWidth={2.5} />
                    )}

                    <span>
                      {isPasswordCheckValid
                        ? "비밀번호가 일치합니다."
                        : "비밀번호가 일치하지 않습니다."}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`mt-8 h-12 w-full rounded-lg font-semibold transition ${
                isFormValid
                  ? "cursor-pointer bg-[#33ddff] text-black hover:opacity-90 active:scale-[0.98]"
                  : "cursor-not-allowed bg-white/10 text-white/30"
              }`}
            >
              회원가입
            </button>

            <p className="mt-6 text-center text-sm text-white/60">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="font-semibold text-[#33ddff] ml-1.5">
                로그인
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
