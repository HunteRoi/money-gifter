import { Form, Button } from 'react-bootstrap';

export default function PaymentForm() {
    const onSubmit = (event) => {
        event.preventDefault();
        const form = event.target;

        if (form.name !== '' && form.amount > 0) {
            const paymentObject = {
                name: form.name,
                amount: form.amount * 1000,
                message: form.message || null,
                isAnonymous: form.isAnonymous
            };
        }
    }

    return <Form onSubmit={onSubmit}>
        <Form.Control type='text' placeholder='Your fullname' required />
        <Form.Control type='number' placeholder='The amount you pay' min='1' step='any' required />
        <Form.Control type='text' as='textarea' placeholder='Your message' />
        <Form.Text className='text-muted'>Your message will be printed on a gift card and given along the money!</Form.Text>

        <Form.Group>
            <Form.Check type='switch' id='isAnonymous' label='Anonymous Gift?' defaultChecked={true} />
        </Form.Group>

        <Button variant='primary' type='submit'>Next</Button>
    </Form>;
}