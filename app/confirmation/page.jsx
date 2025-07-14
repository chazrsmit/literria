// In your payment success page/component
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/panierSlice";

export default function Confirmation() {
    const dispatch = useDispatch()
    
    useEffect(() => {
        // Clear après le payment
        dispatch(clearCart())
    }, [dispatch])
    
    return (
    
        <div>
            <p>Payment successful!</p>
        </div>

    )
}