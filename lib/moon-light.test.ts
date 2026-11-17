import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cameraRight, sunPosition, type Vec3 } from "./moon-light.ts";

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[2] * b[2];
const CAMERAS: Vec3[] = [
  [5.8, 1, 1.75], // hero
  [7.7, 1.3, 2.3], // cosmos moon view
  [8, 0, 0], // exactly on the axis
];

describe("sunPosition", () => {
  for (const cam of CAMERAS) {
    const right = cameraRight(cam);
    const toward: Vec3 = [cam[0], 0, cam[2]];

    it(`first quarter is lit on the camera's right (${cam})`, () => {
      const s = sunPosition(90, cam);
      assert.ok(dot(s, right) > 7.9, "sun sits to the camera's right");
      assert.ok(Math.abs(dot(s, toward) / Math.hypot(...toward)) < 0.01, "and neither in front nor behind");
    });

    it(`last quarter is lit on the left (${cam})`, () => {
      assert.ok(dot(sunPosition(270, cam), right) < -7.9);
    });

    it(`full moon: the sun is behind the camera, new moon: behind the moon (${cam})`, () => {
      assert.ok(dot(sunPosition(180, cam), toward) > 0);
      assert.ok(dot(sunPosition(0, cam), toward) < 0);
    });

    it(`waxing is lit on the right at every phase before full (${cam})`, () => {
      for (const e of [20, 45, 90, 135, 170]) assert.ok(dot(sunPosition(e, cam), right) > 0, `e=${e}`);
      for (const e of [190, 225, 270, 315, 340]) assert.ok(dot(sunPosition(e, cam), right) < 0, `e=${e}`);
    });
  }
});
