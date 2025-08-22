import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import DashboardItems from "components/DashboardItems";
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

        {router.query.paid && auth.user.planIsActive && (
          <Alert
            variant="success"
            className="text-center mx-auto mb-5"
            style={{ maxWidth: "400px" }}
          >
            You are now subscribed to the {auth.user.planId} plan
            <span className="ml-2" role="img" aria-label="party">
              🥳
            </span>
          </Alert>
        )}

        <Row>
          <Col lg={12}>
            <DashboardItems />
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardSection;
