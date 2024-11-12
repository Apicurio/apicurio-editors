import {
  Button,
  Divider,
  Grid,
  GridItem,
  Modal,
  ModalBody,
} from "@patternfly/react-core";
import { FunctionComponent, useCallback, useState } from "react";
import { LicenseService } from "../support/license.service";

interface ChooseLicenseProps {
  useLicense: (license: string) => void;
}

export const ChooseLicense: FunctionComponent<ChooseLicenseProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOnClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const normalizeLicenseName = (licenseName: string) => {
    return (
      licenseName.charAt(0).toUpperCase() +
      licenseName.slice(1).replace(/_/g, " ")
    );
  };

  return (
    <Modal
      className="addPath-modal"
      title={"Choose License"}
      isOpen={isModalOpen}
      variant="large"
      onClose={handleOnClose}
      actions={[
        <span className="pull-left">
          License information provided by{" "}
          <a href="https://choosealicense.com/" target="_blank">
            Choose a License &copy;{" "}
          </a>{" "}
          under the{" "}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
          >
            Create Commons License
          </a>
          .
        </span>,
      ]}
    >
      <ModalBody className="addPath-modal__body">
        <Grid hasGutter component="ul">
          {LicenseService.getLicenses().map((license) => (
            <>
              <GridItem component="li">
                <Grid hasGutter>
                  <GridItem span={6}>
                    <h2>
                      <a href={license.url}>{license.name}</a>
                    </h2>
                  </GridItem>
                  <GridItem span={2}>
                    <b>Permissions</b>
                  </GridItem>
                  <GridItem span={2}>
                    <b>Conditions</b>
                  </GridItem>
                  <GridItem span={2}>
                    <b>Limitations</b>
                  </GridItem>
                  <GridItem span={6}>{license.description}</GridItem>
                  <GridItem span={2}>
                    {license.permissions.map((permission) => (
                      <p>{normalizeLicenseName(permission)}</p>
                    ))}
                  </GridItem>
                  <GridItem span={2}>
                    {license.conditions.map((condition) => (
                      <p>{normalizeLicenseName(condition)}</p>
                    ))}
                  </GridItem>
                  <GridItem span={2}>
                    {license.limitations.map((limitation) => (
                      <p>{normalizeLicenseName(limitation)}</p>
                    ))}
                  </GridItem>
                  <GridItem span={6}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => props.useLicense(license.fullName)}
                    >
                      Use this License
                    </Button>{" "}
                  </GridItem>
                  <GridItem span={6}>
                    <a
                      className="pull-right"
                      href={license.moreInfoUrl}
                      target="_blank"
                    >
                      View full {license.fullName} »
                    </a>
                  </GridItem>
                </Grid>
              </GridItem>
              <Divider />
            </>
          ))}
        </Grid>
      </ModalBody>
    </Modal>
  );
};
