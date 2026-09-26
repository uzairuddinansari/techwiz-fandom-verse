import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import robot from "../model/robot.glb";
const RobotModel = ({ isActive, faceTarget }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(robot);
  const { actions } = useAnimations(animations,group);
  const mouse = useRef({ x: 0,y: 0,});
  const look = useRef({ x: 0,y: 0,});
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x =(event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y =(event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove )
    return () => { window.removeEventListener("mousemove",handleMouseMove);
    };
  }, []);

useFrame(() => {
  if (!group.current) return;

  if (faceTarget) {
    const angle = Math.atan2(
      faceTarget.y,
      faceTarget.x
    );
    const targetY = angle + Math.PI / 2;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
    return;
  }

  // MOUSE ROTATION
  const maxY = 0.30;
  const maxX = 0.25;
  const targetY = Math.PI / -80 + mouse.current.x * maxY;
  const targetX = mouse.current.y * maxX;
  group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
  group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
});

  useEffect(() => {
    const animation = Object.values(actions)[0];

    if (!animation) return;
    if (isActive) {
      animation.reset().fadeIn(0.3).play();
    } else {
      animation.fadeOut(0.3);
      animation.stop();
    }
    return () => {
      animation.stop();
    };
  }, [actions, isActive]);

  return (
    <group ref={group} position={[0, -1, 0]} rotation={[0, Math.PI / -40, 0]} scale={1.5}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(robot);

export default RobotModel;

