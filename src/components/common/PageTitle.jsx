import { Helmet } from "react-helmet-async";

export default function PageTitle({ title }) {
  return (
    <Helmet>
      <title>The Movie | {title}</title>
      <meta
        name="description"
        content="영화와 시리즈 정보를 확인하고 리뷰를 작성할 수 있는 The Movie 입니다"
      />
    </Helmet>
  );
}
