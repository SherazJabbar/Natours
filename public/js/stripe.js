import axios from "axios";
const stripe = Stripe('');
import { showAlert } from './alerts';


export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourId}`);

        console.log(session)

        // 2) Create checkout form  + charge the credit 
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (error) {
        console.log(err)
        showAlert('error', err)
    }
}