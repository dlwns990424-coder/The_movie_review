import { Helmet } from "react-helmet-async";

export default function PageTitle({ title }) {
  return (
    <Helmet>
      <title>{`${title} | MAMORI`}</title>

      <meta
        name="description"
        content="영화와 시리즈를 탐색하고 나만의 리뷰로 마무리하는 MAMORI"
      />
    </Helmet>
  );
}
