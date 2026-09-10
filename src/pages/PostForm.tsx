import Header from '../components/Header';
import Footer from '../components/Footer';
import PostEditor from '../components/PostEditor';

type PostFormProps = {
  isNew: boolean;
};

export default function PostForm({ isNew }: PostFormProps) {
  return (
    <>
      <Header />
      <PostEditor isNew={isNew} />
      <Footer />
    </>
  );
}