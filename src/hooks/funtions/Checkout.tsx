import { useEffect } from "react"
import GetCookies from "../GetCookies"
import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom';
const CheckoutFuntion = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const userToken = GetCookies("Countryside")
        if (!userToken) {
            Swal.fire({
                title: "Bạn chưa đăng nhập ?",
                text: "Hãy đăng nhập để có trải nghiệm ứng dụng",
                confirmButtonColor: "#f8bb86",
                confirmButtonText: "Xác nhận",
                icon: "warning",
            })
            navigate("/login")
            return
        }
    }, [navigate])
}

export default CheckoutFuntion