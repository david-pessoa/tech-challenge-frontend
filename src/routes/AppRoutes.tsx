import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Post from '../pages/Post';
import PostForm from '../pages/PostForm';
import UserRegister from '../pages/UserRegister';
import UserList from '../pages/UserList';
import PrivateRoute from './PrivateRoutes';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/new"
          element={
            <PrivateRoute>
              <PostForm isNew={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/edit/:id"
          element={
            <PrivateRoute>
              <PostForm isNew={false} />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/new"
          element={
            <PrivateRoute>
              <UserRegister isNew={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/edit/:id"
          element={
            <PrivateRoute>
              <UserRegister isNew={false} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/list"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
