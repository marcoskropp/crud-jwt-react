import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default class UpdateUser extends Component {
    state = {
        _id: '',
        name: '',
        email: '',
        dateOfBirth: '',
        accessToken: localStorage.getItem('access_token'),
        alert: false,
        alertMessage: '',
        alertVariant: '',
    };

    async componentDidMount() {
        const responseUser = await api.get(`/user/${this.props.match.params.id}`, { headers: { "Authorization": this.state.accessToken } });

        const { _id, name, email, dateOfBirth, success } = responseUser.data;

        if (success === false) {
            localStorage.clear();
            this.props.history.push('/');
            return;
        }

        this.setState({ _id, name, email, dateOfBirth });
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ alert: false });

        const { _id, name, email, dateOfBirth, accessToken } = this.state;

        if (!name.length || !email.length || !dateOfBirth.length) return;

        const responseUser = await api.put(`/user/${_id}`, { name, email, dateOfBirth }, { headers: { "Authorization": accessToken } });

        const { success, message } = responseUser.data;

        if (success) {
            this.setState({
                alertVariant: 'success',
            });
        }

        this.setState({
            alert: true,
            alertMessage: message,
        });
    };

    render() {
        return (
            <Container className="vertical-align">
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col sm={{ span: 4, offset: 4 }}>
                            <h1 className="d-flex justify-content-center">EDITAR</h1>
                            {
                                this.state.alert &&
                                <Alert variant={this.state.alertVariant} dismissible>
                                    {this.state.alertMessage}
                                </Alert>
                            }
                            <Form.Group controlId="name">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="name" type="text" placeholder="Nome" value={this.state.name} />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="email" type="email" placeholder="Email" value={this.state.email} />
                            </Form.Group>
                            <Form.Group controlId="dateOfBirth">
                                <Form.Label>Data de Nascimento</Form.Label>
                                <Form.Control onChange={this.handleInputChange} name="dateOfBirth" type="date" placeholder="Data de Nascimento" value={this.state.dateOfBirth} />
                            </Form.Group>
                            <Button variant="btn btn-outline-dark" block type="submit">
                                Editar
                            </Button>
                            <Link className="btn btn-outline-dark fullWidthWithSpace" to={'/dashboard'} >
                                Voltar
                            </Link>
                        </Col>
                    </Row>
                </Form>
            </Container>
        );
    }
}