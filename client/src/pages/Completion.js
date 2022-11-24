import { Button } from 'react-bootstrap';

function Completion() {
  const goHomepage = () => window.location.href = '/';

  return <>
    <h1>Thank you! 🎉</h1>

    <Button variant='primary' onClick={goHomepage}>Fill the form again!</Button>
  </>;
}

export default Completion;
