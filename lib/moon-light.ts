/**
 * Sun position for the 3D moon, relative to the CAMERA.
 *
 * The camera looks at the moon from the Earth's direction but never exactly along the
 * Earth-Moon axis (it sits a few degrees off for a more interesting view). A sun placed on world axes
 * therefore showed the wrong phase by that offset, and with the wrong sign the waxing moon was lit on
 * the left. So the light is built in the camera's own frame:
 *   - toward the camera  = the Earth side: full moon (elongation 180°),
 *   - camera's right     = first quarter (90°): waxing is lit on the RIGHT, as in the northern hemisphere,
 *   - away from camera   = new moon (0°).
 * Then it is turned into world coordinates. `lift` tips the light slightly from above, like the old scene.
 */
export type Vec3 = [number, number, number];

export function sunPosition(elongationDeg: number, camera: Vec3, distance = 8, lift = 0.6): Vec3 {
  const a = (elongationDeg * Math.PI) / 180;
  const sx = Math.sin(a); // + = the camera's right
  const sz = -Math.cos(a); // + = toward the camera
  const [cx, , cz] = camera;
  const len = Math.hypot(cx, cz);
  const toward: Vec3 = [cx / len, 0, cz / len];
  const right: Vec3 = [cz / len, 0, -cx / len]; // forward x up, forward = -camera
  return [
    (sx * right[0] + sz * toward[0]) * distance,
    lift,
    (sx * right[2] + sz * toward[2]) * distance,
  ];
}

/** Camera right-hand direction (horizontal), exposed for tests. */
export function cameraRight(camera: Vec3): Vec3 {
  const len = Math.hypot(camera[0], camera[2]);
  return [camera[2] / len, 0, -camera[0] / len];
}
