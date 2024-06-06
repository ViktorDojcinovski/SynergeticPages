export default function index() {
  return <div>Landing Page</div>;
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      data: null,
    },
  };
}
