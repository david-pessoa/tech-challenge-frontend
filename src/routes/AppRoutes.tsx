import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Post from '../pages/Post';
import PostForm from '../pages/PostForm';
import UserRegister from '../pages/UserRegister';
import UserList from '../pages/UserList';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/new" element={<PostForm isNew={true} />} />
        <Route path="/post/edit/:id" element={<PostForm isNew={false} />} />

        <Route path="/user/new" element={<UserRegister isNew={true} />} />
        <Route path="/user/edit/:id" element={<UserRegister isNew={false} />} />
        <Route path="/user/list" element={<UserList />} />
      </Routes>
    </Router>
  );
}
