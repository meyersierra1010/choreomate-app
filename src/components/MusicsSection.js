import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useRouter } from "next/router";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import DashboardMusics from "components/DashboardMusics";
import { useAuth } from "util/auth";

function DashboardSection(props) {
    const auth = useAuth();
    const router = useRouter();

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />

                <Row>
                    <Col lg={12}>
                        <DashboardMusics />
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default DashboardSection;
