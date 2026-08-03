import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import PageTitle from "../components/common/PageTitle";
import { toast } from "sonner";
export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      toast("비밀번호를 입력해주세요.");
      return;
    }

    try {
      login({
        username: username.trim(),
        password,
      });

      navigate("/");
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <>
      <PageTitle title="로그인" />

      <div className="flex min-h-screen items-center justify-center bg-black px-5">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] rounded-2xl bg-zinc-900 p-8"
        >
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            로그인
          </h1>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm text-white/70"
              >
                아이디
              </label>

              <input
                id="username"
                type="text"
                placeholder="아이디를 입력해주세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-white/20
                  bg-black
                  px-4
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/30
                  focus:border-[#33ddff]
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-white/70"
              >
                비밀번호
              </label>

              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-white/20
                  bg-black
                  px-4
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/30
                  focus:border-[#33ddff]
                "
              />
            </div>
          </div>

          <button
            type="submit"
            className="
              mt-8
              h-12
              w-full
              cursor-pointer
              rounded-lg
              bg-[#33ddff]
              font-semibold
              text-black
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            로그인
          </button>

          <p className="mt-6 text-center text-sm text-white/60">
            아직 계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#33ddff] hover:underline"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
