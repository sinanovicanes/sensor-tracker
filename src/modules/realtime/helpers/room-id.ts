export class RoomId {
  /**
   * Generate a room ID for a sensor.
   * @param sensorId
   * @returns roomId - sensor-{sensorId}
   */
  static sensor(sensorId: string) {
    return `sensor-${sensorId}`;
  }

  /**
   * Generate a room ID for a company.
   * @param companyId
   * @returns roomId - company-{companyId}
   */
  static company(companyId: string) {
    return `company-${companyId}`;
  }
}
