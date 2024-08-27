import license_data from '../assets/license_data.json';

const LICENSE_DATA = license_data;

export interface ILicense {
    id: string;
    name: string;
    fullName: string;
    description: string;
    url: string;
    moreInfoUrl: string;
    permissions: string[];
    conditions: string[];
    limitations: string[];
}

export class LicenseService {

  /**
   * Returns a list of all licenses.
   *
   */
  public static getLicenses(): ILicense[] {
      return LICENSE_DATA;
  }
}
