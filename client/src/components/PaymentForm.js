import { Form, Button } from 'react-bootstrap';

export default function PaymentForm({ onNext }) {
    const onSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        if (form.fullname.value !== ''
            && form.amount.value >= 1
            && form.amount.value <= 250) {
            onNext({
                fullname: form.fullname.value,
                amount: form.amount.value * 100,
                message: form.message.value || null,
                isAnonymous: form.isAnonymous.checked
            });
        }
    }

    return <Form onSubmit={onSubmit}>
        <Form.Control type='text' placeholder='Your fullname' name='fullname' required />
        <Form.Control type='number' placeholder='The amount you pay' min='1' max='250' step='any' name='amount' required />
        <Form.Control type='text' as='textarea' name='message' placeholder='Your message' />
        <Form.Text className='text-muted'>Your message will be printed on a gift card and given along the money!</Form.Text>

        <Form.Group>
            <Form.Check type='switch' id='isAnonymous' name='isAnonymous' label='Anonymous Gift?' defaultChecked={true} />
        </Form.Group>

        <Button variant='primary' type='submit'>Next</Button>
    </Form>;
}