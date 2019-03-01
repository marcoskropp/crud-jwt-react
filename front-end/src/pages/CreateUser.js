import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default class CreateUser extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        alert: false,
        alertMessage: '',
        alertVariant: '',
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ alert: false });
        const { name, email, password, dateOfBirth } = this.state;

        if (!name.length || !email.length || !password.length || !dateOfBirth.length) return;

        const responseUser = await api.post('/user', { name, email, password, dateOfBirth });

        if (responseUser.data.success) {
            this.setState({
                alertVariant: 'success',
            });
        } else {
            this.setState({
                alertVariant: 'danger',
            });
        }
        this.setState({
            alert: true,
            alertMessage: responseUser.data.message
        });
    };


    render() {
        return (
            <Container className="vertical-align">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col sm={{ span: 4, offset: 4 }}>
                            <h1 className="d-flex justify-content-center">REGISTRAR</h1>
                            {
                                this.state.alert &&
                                <Alert variant={this.state.alertVariant} dismissible>
                                    {this.state.alertMessage}
                                </Alert>
                            }
                            <Form.Group controlId="name">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="name" type="text" placeholder="Nome" />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="email" type="email" placeholder="Email" />
                            </Form.Group>
                            <Form.Group controlId="dateOfBirth">
                                <Form.Label>Data de Nascimento</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="dateOfBirth" type="date" placeholder="Data de Nascimento" />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="password" type="password" placeholder="Senha" />
                            </Form.Group>
                            <Button variant="btn btn-outline-dark" block type="submit">
                                Cadastrar
                            </Button>
                            <Link className="btn btn-outline-dark fullWidthWithSpace" to={'/'} >
                                Voltar
                            </Link>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}