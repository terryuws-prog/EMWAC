import {
  getDashboardModel,
  getSiteDetailModel,
  getSitesModel,
} from "./repository";

describe("monitoring repository", () => {
  it("builds dashboard summary counts", () => {
    const model = getDashboardModel();

    expect(model.summary.totalSites).toBe(3);
    expect(model.summary.warningSites).toBe(2);
    expect(model.summary.offlineSites).toBe(1);
    expect(model.summary.activeAlerts).toBe(4);
  });

  it("returns site summaries sorted by operational urgency", () => {
    const model = getSitesModel();

    expect(model[0].status).toBe("critical");
    expect(model[0].name).toBe("Tidal Reach");
  });

  it("returns full detail for a valid site id", () => {
    const detail = getSiteDetailModel("site-black-covert");

    expect(detail?.site.name).toBe("Black Covert");
    expect(detail?.history.length).toBeGreaterThan(2);
    expect(detail?.latestReading.metrics.ph).toBeCloseTo(7.3);
  });

  it("returns null for an unknown site id", () => {
    expect(getSiteDetailModel("missing-site")).toBeNull();
  });
});
