import { Link } from "react-router-dom";

export default function Error() {
    return (
        <div className="text-center p-5">
            <h1 className="text-danger">404</h1>
            <p>Trang không tồn tại hoặc đã xảy ra lỗi.</p>
            <Link to="/" className="btn btn-primary">
                Về trang chủ
            </Link>
        </div>
    );
}