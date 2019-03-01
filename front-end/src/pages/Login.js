import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './Login.css';
import api from '../services/api';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
        alert: false,
        alertMessage: '',
        alertVariant: '',
    };

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ alert: false });

        const { email, password } = this.state;
        if (!email.length || !password.length) return;

        const responseLogin = await api.post('/login', { email, password });
        const { success, message, token } = responseLogin.data;
        if (success) {
            localStorage.setItem('access_token', token);

            this.props.history.push('/dashboard');

        } else {
            this.setState({
                alert: true,
                alertVariant: 'danger',
                alertMessage: message
            });
        }
    }

    render() {

        return (
            <Container className="vertical-align">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col sm={{ span: 4, offset: 4 }}>
                            <h1 className="d-flex justify-content-center">LOGIN</h1>
                            {
                                this.state.alert &&
                                <Alert variant={this.state.alertVariant} dismissible>
                                    {this.state.alertMessage}
                                </Alert>
                            }
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Email" onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Senha" onChange={this.handleInputChange} />
                            </Form.Group>
                            <Button variant="btn btn-outline-dark" block type="submit">
                                Enviar
                            </Button>
                            <Link className="btn btn-outline-dark fullWidthWithSpace" to={'/createUser'} >
                                Cadastrar
                            </Link>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}