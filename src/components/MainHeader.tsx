import logo from "../assets/logo-40-nam-trang-chu.svg";

interface MainHeaderProps {
    onToggleMenu?: () => void;
}

export default function MainHeader({ onToggleMenu }: MainHeaderProps) {
    return (
        <div className="d-flex justify-content-between align-items-center bg-white p-2 border-bottom">

            <div className="d-flex align-items-center gap-2">
                <button onClick={onToggleMenu} className="btn btn-outline-dark btn-sm">
                    <i className="fa-solid fa-bars"></i>
                </button>

                <div className="d-flex align-items-center border rounded px-2 bg-light">
                    <i className="fa-solid fa-magnifying-glass text-secondary me-2"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="form-control form-control-sm border-0 bg-transparent"
                    />
                </div>
            </div>

            <a href="/">
                <img src={logo} alt="Logo" style={{ height: "40px" }} />
            </a>

            <div className="d-flex gap-2">
                <a className="btn btn-warning btn-sm rounded-pill"
                   href="https://banggia.thanhnien.vn/"
                   target="_blank">
                    <i className="fa-solid fa-bullhorn me-1"></i>QUẢNG CÁO
                </a>

                <a className="btn btn-warning btn-sm rounded-pill"
                   href="https://datbao.thanhnien.vn/"
                   target="_blank">
                    <i className="fa-solid fa-newspaper me-1"></i>ĐẶT BÁO
                </a>

                <a className="btn btn-info btn-sm rounded-pill text-white"
                    href="https://my.thanhnien.vn/page/login.html">
                    <i className="fa-solid fa-user me-1"></i>ĐĂNG NHẬP
                </a>
            </div>

        </div>
    );
}