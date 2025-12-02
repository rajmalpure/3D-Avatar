import * as THREE from 'three'

/**
 * Audio analyzer for lip sync
 */
export class AudioAnalyzer {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array<ArrayBuffer> | null = null
  private source: MediaElementAudioSourceNode | AudioBufferSourceNode | null = null

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(new ArrayBuffer(bufferLength))
    }
  }

  connectAudioElement(audio: HTMLAudioElement) {
    this.initialize()
    if (this.audioContext && this.analyser) {
      this.source = this.audioContext.createMediaElementSource(audio)
      this.source.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
    }
  }

  getFrequencyData(): Uint8Array | null {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray)
      return this.dataArray
    }
    return null
  }

  getAmplitude(): number {
    const data = this.getFrequencyData()
    if (!data) return 0

    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum += data[i]
    }
    return sum / (data.length * 255) // Normalize to 0-1
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
  }

  close() {
    this.disconnect()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.analyser = null
    this.dataArray = null
  }
}

/**
 * Helper to make the avatar look at a point
 */
export function lookAtPoint(
  head: THREE.Object3D,
  targetPoint: THREE.Vector3,
  smoothing: number = 0.1
) {
  const lookAtMatrix = new THREE.Matrix4()
  lookAtMatrix.lookAt(head.position, targetPoint, head.up)
  
  const targetQuaternion = new THREE.Quaternion()
  targetQuaternion.setFromRotationMatrix(lookAtMatrix)
  
  head.quaternion.slerp(targetQuaternion, smoothing)
}

/**
 * Calculate eye target from mouse position
 */
export function getEyeTarget(
  mouseX: number,
  mouseY: number,
  distance: number = 2
): THREE.Vector3 {
  // Convert normalized mouse coords (-1 to 1) to 3D point
  const x = mouseX * 0.5
  const y = mouseY * 0.5
  const z = distance
  
  return new THREE.Vector3(x, y, z)
}

/**
 * Apply blendshape/morph target
 */
export function applyMorphTarget(
  mesh: THREE.Mesh,
  targetName: string,
  value: number
) {
  if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
    const index = mesh.morphTargetDictionary[targetName]
    if (index !== undefined) {
      mesh.morphTargetInfluences[index] = THREE.MathUtils.clamp(value, 0, 1)
    }
  }
}

/**
 * Get all available morph targets from a mesh
 */
export function getMorphTargets(mesh: THREE.Mesh): string[] {
  if (mesh.morphTargetDictionary) {
    return Object.keys(mesh.morphTargetDictionary)
  }
  return []
}
