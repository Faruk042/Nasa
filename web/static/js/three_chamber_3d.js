/* ============================================================================
   ALTAR-NASA 3B ISS Yanma Odası (CIR Digital Twin) & Organik GLSL Alev Motoru
   Three.js WebGL • Özel GLSL Kemilüminesans/Kurum Shader • Yay Fiziği (Easing)
   ============================================================================ */

(function () {
    "use strict";

    function createRadialGlowTexture() {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext("2d");
        const grad = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.22, "rgba(56, 189, 248, 0.55)");
        grad.addColorStop(0.55, "rgba(29, 78, 216, 0.18)");
        grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
    }

    const FLAME_VERTEX_SHADER = `
        uniform float uTime;
        uniform float uGravity;
        uniform float uAirflow;
        uniform float uCoolFlame;
        uniform float uShellScale;

        varying vec3 vNormalView;
        varying vec3 vViewPos;
        varying vec3 vLocalPos;
        varying float vNoiseVal;

        // Çok katmanlı organik 3B akışkan türbülansı (Robotik tekil sinüs yerine 4-oktav harmonik gürültü)
        float organicTurbulence(vec3 p, float t) {
            float n1 = sin(p.x * 3.1 + t * 2.3) * cos(p.y * 2.7 - t * 3.1) * sin(p.z * 3.3 + t * 1.7);
            float n2 = 0.5 * sin(p.x * 6.4 - t * 4.2 + p.y * 3.8) * cos(p.z * 5.9 + t * 3.5);
            float n3 = 0.25 * cos(p.y * 11.2 - t * 6.8 + p.x * 5.1);
            return n1 + n2 + n3;
        }

        void main() {
            vec3 pos = position * uShellScale;
            vLocalPos = position;

            float upFactor = clamp((position.y + 1.0) * 0.5, 0.0, 1.0);
            float turb = organicTurbulence(position, uTime);
            vNoiseVal = turb;

            // 1) 1G Kaldırma Kuvveti (Buoyancy): Gözyaşı uzaması ve üst uç sivrilmesi
            float buoyStretch = uGravity * 1.55 * pow(upFactor, 1.35);
            pos.y += buoyStretch;
            float taper = 1.0 - uGravity * 0.54 * pow(upFactor, 1.45);
            pos.x *= max(0.22, taper);
            pos.z *= max(0.22, taper);

            // 1G doğal kırpışma salınımı (8-10 Hz organik titreme; 0G durgun havada neredeyse sıfır!)
            float flickerAmp = (0.014 + uGravity * 0.085 + clamp(uAirflow / 35.0, 0.0, 0.06)) * (0.3 + upFactor);
            pos += normal * turb * flickerAmp;
            pos.x += uGravity * sin(uTime * 7.4 + position.y * 2.8) * 0.045 * pow(upFactor, 1.6);

            // 2) 0G Kabin Havalandırma Akışı (-X yönünden gelen fan rüzgarı -> +X yönünde kuyruk uzaması)
            float flowNorm = clamp(uAirflow / 25.0, 0.0, 1.35);
            if (pos.x < 0.0) {
                // Rüzgara bakan durgunluk yayı (stagnation front) damlacığa yaklaşır
                pos.x *= (1.0 - 0.30 * clamp(flowNorm, 0.0, 0.85));
            } else {
                // Arka iz bölgesi (wake tail) kuyruklu yıldız gibi uzar ve hafifçe açılır
                float wake = pow(clamp(position.x, 0.0, 1.0), 1.15);
                pos.x += flowNorm * 1.45 * wake;
                pos.y += sin(uTime * 5.2 - position.x * 4.0) * 0.05 * flowNorm * wake;
                pos.z += cos(uTime * 4.6 - position.x * 3.6) * 0.04 * flowNorm * wake;
            }

            // 3) Soğuk Alev (Cool Flame) NTC termokinetik nabız salınımı
            if (uCoolFlame > 0.05) {
                float pulse = 1.0 + 0.075 * sin(uTime * 4.2) * uCoolFlame;
                pos *= pulse;
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vViewPos = -mvPosition.xyz;
            vNormalView = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const FLAME_FRAGMENT_SHADER = `
        uniform float uTime;
        uniform float uIntensity;
        uniform float uSoot;
        uniform float uCoolFlame;
        uniform float uGravity;
        uniform float uAirflow;
        uniform float uLayerType; // 0: İç Buhar/Çekirdek, 1: Ana CH* Reaksiyon Zarı, 2: Dış Termal Hale

        varying vec3 vNormalView;
        varying vec3 vViewPos;
        varying vec3 vLocalPos;
        varying float vNoiseVal;

        void main() {
            if (uIntensity <= 0.01) discard;

            vec3 viewDir = normalize(vViewPos);
            float ndotv = abs(dot(normalize(vNormalView), viewDir));

            // Gerçek 0G Difüzyon Alevi Fiziği: İnce küresel reaksiyon zarı kenarlarda (teğetsel bakışta) daha parlaktır!
            float rimShell = pow(1.0 - ndotv, 1.55);
            float softCore = pow(ndotv, 0.75) * 0.42;
            float shellProfile = mix(rimShell * 1.15 + softCore, pow(ndotv, 1.4), uLayerType == 0.0 ? 0.65 : 0.15);

            // Kemilüminesans renk paleti (CH* safir mavi & OH* buz mavisi)
            vec3 deepCobalt = vec3(0.07, 0.24, 0.88);
            vec3 sapphireCyan = vec3(0.12, 0.76, 1.00);
            vec3 hotWhiteBlue = vec3(0.84, 0.96, 1.00);

            // Planck Kara Cisim Kurum (Soot) renk paleti (Üst uçta ve 1G'de sarı-kehribar ışıma)
            vec3 sootAmber = vec3(1.00, 0.56, 0.10);
            vec3 sootGold = vec3(1.00, 0.88, 0.48);

            float heightZone = clamp((vLocalPos.y + 0.55) * 0.75, 0.0, 1.0);
            float wakeZone = clamp((vLocalPos.x + 0.2) * 0.7, 0.0, 1.0) * clamp(uAirflow / 18.0, 0.0, 1.0);
            float sootRegion = clamp(uSoot * (heightZone * (0.35 + 0.65 * uGravity) + wakeZone * 0.55 + 0.18), 0.0, 1.0);

            vec3 baseBlue = mix(deepCobalt, sapphireCyan, clamp(rimShell * 1.2 + 0.25 + vNoiseVal * 0.12, 0.0, 1.0));
            baseBlue = mix(baseBlue, hotWhiteBlue, clamp(pow(1.0 - ndotv, 3.2) * 0.75, 0.0, 1.0));

            vec3 sootColor = mix(sootAmber, sootGold, clamp(heightZone * 0.8 + vNoiseVal * 0.15, 0.0, 1.0));
            vec3 hotFlameColor = mix(baseBlue, sootColor, sootRegion);

            // Soğuk Alev (Cool Flame 550-750 K): Görünmez UV/Formaldehit hayaletimsi menekşe-turkuaz ışıması
            float cfPulse = 0.78 + 0.22 * sin(uTime * 4.2 + vLocalPos.y * 2.0);
            vec3 coolViolet = vec3(0.56, 0.28, 0.98);
            vec3 coolCyan = vec3(0.24, 0.82, 0.96);
            vec3 coolColor = mix(coolViolet, coolCyan, rimShell) * cfPulse;

            vec3 finalColor = mix(hotFlameColor, coolColor, uCoolFlame);

            float alpha = shellProfile * uIntensity;
            if (uLayerType == 2.0) {
                alpha *= 0.34;
            } else if (uLayerType == 0.0) {
                alpha *= 0.45;
            }
            if (uCoolFlame > 0.5) {
                alpha *= 0.58 * cfPulse;
            }

            gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.92));
        }
    `;

    class Chamber3DEngine {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container || typeof THREE === "undefined") return;

            this.clock = new THREE.Clock();
            this.igniterTimer = 1.6;
            this.dropletLifeRatio = 1.0;

            // Hedef ve Yumuşatılmış (Spring/Lerp) Fiziksel Durumlar
            this.target = {
                flameRadiusMm: 8.5,
                dropletRadiusMm: 1.6,
                gravity: 0.0,
                airflow: 0.2,
                soot: 0.12,
                coolFlame: 0.0,
                intensity: 1.0,
                tempK: 1980.0,
                fuelPhase: "liquid_droplet",
            };
            this.smooth = Object.assign({}, this.target);

            // Küresel Yörünge Kamera Durumu
            this.camOrbit = {
                theta: 0.35,
                phi: 1.38,
                radius: 7.4,
                targetTheta: 0.35,
                targetPhi: 1.38,
                targetRadius: 7.4,
                panY: 0.15,
                dragging: false,
                lastX: 0,
                lastY: 0,
            };

            this._initScene();
            this._buildChamberHardware();
            this._buildFuelAndFlame();
            this._buildFlowStreamlines();
            this._bindInteractions();
            this._animate();
        }

        _initScene() {
            const w = this.container.clientWidth || 720;
            const h = this.container.clientHeight || 555;

            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x050a15, 0.042);

            this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            this.renderer.setSize(w, h);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.container.innerHTML = "";
            this.container.appendChild(this.renderer.domElement);

            // Aydınlatma: Yumuşak kabin enstrüman ışığı + alevin kendi dinamik nokta ışığı
            this.ambientLight = new THREE.AmbientLight(0x334d77, 0.85);
            this.scene.add(this.ambientLight);

            const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.65);
            rimLight.position.set(-5, 6, 4);
            this.scene.add(rimLight);

            this.flameLight = new THREE.PointLight(0x38bdf8, 2.4, 14, 1.6);
            this.flameLight.position.set(0, 0.1, 0);
            this.scene.add(this.flameLight);
        }

        _buildChamberHardware() {
            this.hardwareGroup = new THREE.Group();
            this.scene.add(this.hardwareGroup);

            const metalMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                metalness: 0.78,
                roughness: 0.32,
            });
            const accentMetal = new THREE.MeshStandardMaterial({
                color: 0x334155,
                metalness: 0.85,
                roughness: 0.24,
            });

            // Alt ve Üst ISS CIR Yanma Odası Flanş Halkaları
            const ringGeo = new THREE.TorusGeometry(3.8, 0.11, 16, 64);
            const bottomRing = new THREE.Mesh(ringGeo, metalMat);
            bottomRing.rotation.x = Math.PI / 2;
            bottomRing.position.y = -2.35;
            this.hardwareGroup.add(bottomRing);

            const topRing = new THREE.Mesh(ringGeo, metalMat);
            topRing.rotation.x = Math.PI / 2;
            topRing.position.y = 2.55;
            this.hardwareGroup.add(topRing);

            // 4 Dikey Taşıyıcı Kolon
            const strutGeo = new THREE.CylinderGeometry(0.065, 0.065, 4.9, 12);
            for (let i = 0; i < 4; i++) {
                const ang = (i * Math.PI) / 2 + Math.PI / 4;
                const strut = new THREE.Mesh(strutGeo, accentMetal);
                strut.position.set(Math.cos(ang) * 3.8, 0.1, Math.sin(ang) * 3.8);
                this.hardwareGroup.add(strut);
            }

            // Alt Kalibrasyon Ölçek Izgarası
            const grid = new THREE.GridHelper(6.8, 14, 0x1e3a8a, 0x0f1f3d);
            grid.position.y = -2.34;
            this.hardwareGroup.add(grid);

            // Çapraz İnce Kuvars Tutucu Lifler (NASA FLEX SiC/Quartz Tether Filaments)
            const quartzMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.42 });
            const fiberGeo = new THREE.CylinderGeometry(0.009, 0.009, 5.4, 8);
            const fiber1 = new THREE.Mesh(fiberGeo, quartzMat);
            fiber1.rotation.z = Math.PI / 2.35;
            this.hardwareGroup.add(fiber1);

            const fiber2 = new THREE.Mesh(fiberGeo, quartzMat);
            fiber2.rotation.z = -Math.PI / 2.35;
            fiber2.rotation.y = 0.55;
            this.hardwareGroup.add(fiber2);

            // 1) Termokupl Sıcaklık Probu (Sol Üstten Yaklaşan İnce Sensör İğnesi)
            const probeArmGeo = new THREE.CylinderGeometry(0.025, 0.035, 1.9, 10);
            const probeArm = new THREE.Mesh(probeArmGeo, accentMetal);
            probeArm.position.set(-1.95, 0.85, 0);
            probeArm.rotation.z = -1.15;
            this.hardwareGroup.add(probeArm);

            this.thermocoupleBeadMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
            const bead = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), this.thermocoupleBeadMat);
            bead.position.set(-1.08, 0.44, 0);
            this.hardwareGroup.add(bead);

            // 2) Kızılötesi (IR) Radyometre Optik Merceği (Sağ Yan Gözlem Kolu)
            const radBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.7, 20), accentMetal);
            radBody.rotation.z = Math.PI / 2;
            radBody.position.set(3.25, 0.0, 0);
            this.hardwareGroup.add(radBody);

            const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
            const radLens = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 20), lensMat);
            radLens.rotation.z = Math.PI / 2;
            radLens.position.set(2.89, 0.0, 0);
            this.hardwareGroup.add(radLens);

            // 3) Sıcak Tel Ateşleyici Kol (Hot-Wire Igniter)
            this.igniterMat = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
            this.igniterTip = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 20), this.igniterMat);
            this.igniterTip.position.set(0.0, -0.58, 0.25);
            this.hardwareGroup.add(this.igniterTip);
        }

        _buildFuelAndFlame() {
            // Merkez Yakıt Damlacığı / Numunesi
            this.fuelMat = new THREE.MeshPhysicalMaterial({
                color: 0xcbd5e1,
                roughness: 0.12,
                metalness: 0.1,
                transmission: 0.45,
                transparent: true,
                opacity: 0.92,
            });
            this.dropletMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), this.fuelMat);
            this.scene.add(this.dropletMesh);

            // Katı yakıt (PMMA Çubuk - BASS / SoFIE) seçildiğinde gösterilecek silindirik numune
            this.solidSampleMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.20, 0.20, 0.92, 28),
                new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28, metalness: 0.08 })
            );
            this.solidSampleMesh.rotation.z = Math.PI / 2;
            this.solidSampleMesh.visible = false;
            this.scene.add(this.solidSampleMesh);

            // İnce Kumaş / Plaka Numunesi (Sibal / Nomex - Saffire & BASS-II)
            this.flatSlabGroup = new THREE.Group();
            const slabMesh = new THREE.Mesh(
                new THREE.BoxGeometry(1.05, 0.045, 0.56),
                new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.68, metalness: 0.05 })
            );
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.32, metalness: 0.85 });
            const rail1 = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.07, 0.05), frameMat);
            rail1.position.z = 0.29;
            const rail2 = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.07, 0.05), frameMat);
            rail2.position.z = -0.29;
            this.flatSlabGroup.add(slabMesh, rail1, rail2);
            this.flatSlabGroup.visible = false;
            this.scene.add(this.flatSlabGroup);

            // Küresel Gözenekli Sinterlenmiş Pirinç Gaz Brülörü (ACME CFI-G %85 O2 / BRE / Gaz Jeti)
            this.porousBurnerGroup = new THREE.Group();
            const brassSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.30, 28, 28),
                new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.48, metalness: 0.82 })
            );
            const feedTube = new THREE.Mesh(
                new THREE.CylinderGeometry(0.048, 0.048, 2.15, 14),
                new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.28, metalness: 0.88 })
            );
            feedTube.position.y = -1.18;
            this.porousBurnerGroup.add(brassSphere, feedTube);
            this.porousBurnerGroup.visible = false;
            this.scene.add(this.porousBurnerGroup);

            // 3 Katmanlı Hacimsel GLSL Alev Küresi (İç Buhar, Ana CH* Reaksiyon Zarı, Dış Termal Hale)
            this.flameLayers = [];
            const configs = [
                { scale: 0.80, layerType: 0.0 },
                { scale: 1.00, layerType: 1.0 },
                { scale: 1.22, layerType: 2.0 },
            ];
            const sphereGeo = new THREE.SphereGeometry(1.0, 64, 64);

            configs.forEach((cfg) => {
                const mat = new THREE.ShaderMaterial({
                    vertexShader: FLAME_VERTEX_SHADER,
                    fragmentShader: FLAME_FRAGMENT_SHADER,
                    transparent: true,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending,
                    uniforms: {
                        uTime: { value: 0.0 },
                        uGravity: { value: 0.0 },
                        uAirflow: { value: 0.2 },
                        uCoolFlame: { value: 0.0 },
                        uShellScale: { value: cfg.scale },
                        uIntensity: { value: 1.0 },
                        uSoot: { value: 0.12 },
                        uLayerType: { value: cfg.layerType },
                    },
                });
                const mesh = new THREE.Mesh(sphereGeo, mat);
                this.scene.add(mesh);
                this.flameLayers.push(mesh);
            });

            // Kamera Yumuşak Işık Parlaması (Gaussian Bloom Sprite)
            const glowTex = createRadialGlowTexture();
            this.glowSpriteMat = new THREE.SpriteMaterial({
                map: glowTex,
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            this.glowSprite = new THREE.Sprite(this.glowSpriteMat);
            this.glowSprite.scale.set(3.4, 3.4, 1.0);
            this.scene.add(this.glowSprite);
        }

        _buildFlowStreamlines() {
            // Kabin Havalandırma Akış Parçacıkları (-X -> +X akım çizgileri & 1G duman/is yükselişi)
            const count = 130;
            this.particleData = [];
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const px = (Math.random() - 0.5) * 6.8;
                const py = (Math.random() - 0.5) * 3.2;
                const pz = (Math.random() - 0.5) * 3.2;
                positions[i * 3] = px;
                positions[i * 3 + 1] = py;
                positions[i * 3 + 2] = pz;
                this.particleData.push({ x: px, y: py, z: pz, phase: Math.random() * Math.PI * 2 });
            }

            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

            this.particleMat = new THREE.PointsMaterial({
                color: 0x7dd3fc,
                size: 0.055,
                transparent: true,
                opacity: 0.45,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            this.flowParticles = new THREE.Points(pGeo, this.particleMat);
            this.scene.add(this.flowParticles);
        }

        _bindInteractions() {
            const dom = this.renderer.domElement;

            dom.addEventListener("pointerdown", (e) => {
                this.camOrbit.dragging = true;
                this.camOrbit.lastX = e.clientX;
                this.camOrbit.lastY = e.clientY;
            });

            window.addEventListener("pointerup", () => {
                this.camOrbit.dragging = false;
            });

            window.addEventListener("pointermove", (e) => {
                if (!this.camOrbit.dragging) return;
                const dx = e.clientX - this.camOrbit.lastX;
                const dy = e.clientY - this.camOrbit.lastY;
                this.camOrbit.lastX = e.clientX;
                this.camOrbit.lastY = e.clientY;
                this.camOrbit.targetTheta -= dx * 0.0075;
                this.camOrbit.targetPhi = Math.max(0.28, Math.min(2.75, this.camOrbit.targetPhi - dy * 0.0075));
            });

            dom.addEventListener("wheel", (e) => {
                e.preventDefault();
                this.camOrbit.targetRadius = Math.max(3.0, Math.min(13.5, this.camOrbit.targetRadius + e.deltaY * 0.0045));
            }, { passive: false });

            if (typeof ResizeObserver !== "undefined") {
                const ro = new ResizeObserver(() => this.resize());
                ro.observe(this.container);
            } else {
                window.addEventListener("resize", () => this.resize());
            }
        }

        resize() {
            if (!this.container || !this.renderer) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            if (w > 20 && h > 20) {
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            }
        }

        setCameraPreset(presetName) {
            if (presetName === "front") {
                this.camOrbit.targetTheta = 0.25;
                this.camOrbit.targetPhi = 1.42;
                this.camOrbit.targetRadius = 7.2;
            } else if (presetName === "macro") {
                this.camOrbit.targetTheta = 0.55;
                this.camOrbit.targetPhi = 1.48;
                this.camOrbit.targetRadius = 3.6;
            } else if (presetName === "top") {
                this.camOrbit.targetTheta = 0.0;
                this.camOrbit.targetPhi = 0.34;
                this.camOrbit.targetRadius = 8.2;
            } else if (presetName === "sensors") {
                this.camOrbit.targetTheta = -0.85;
                this.camOrbit.targetPhi = 1.22;
                this.camOrbit.targetRadius = 6.2;
            }
        }

        reigniteDroplet() {
            this.dropletLifeRatio = 1.0;
            this.igniterTimer = 1.8;
            // Gerçekçi termal tutuşma parlaması (Thermal Ignition Overshoot)
            this.smooth.flameRadiusMm *= 1.24;
            this.smooth.intensity = 1.25;
        }

        updateFromSimulation(simData) {
            if (!simData || !simData.telemetry || !simData.inputs) return;
            const tel = simData.telemetry;
            const inp = simData.inputs;

            let geom = inp.geometry_3d || "droplet";
            if (!inp.geometry_3d) {
                if (inp.fuel_id === "pmma") geom = "solid_rod";
                else if (inp.fuel_id === "sibal" || inp.fuel_id === "nomex") geom = "flat_slab";
                else if (inp.fuel_id === "hydrogen" || inp.fuel_id === "propane_cfig") geom = "porous_sphere";
            }
            this.target.fuelPhase = geom;
            this.target.dropletRadiusMm = Math.max(0.6, inp.droplet_d0_mm * 0.5);
            this.target.flameRadiusMm = tel.extinguished ? 0.2 : Math.max(2.6, tel.flame_radius_mm);
            this.target.gravity = inp.gravity_g;
            this.target.airflow = inp.airflow_cms;
            this.target.soot = tel.soot_index;
            this.target.coolFlame = tel.cool_flame_active ? 1.0 : 0.0;
            this.target.intensity = tel.extinguished ? 0.0 : 1.0;
            this.target.tempK = tel.flame_temp_k;
        }

        _animate() {
            requestAnimationFrame(() => this._animate());
            const dt = Math.min(0.05, this.clock.getDelta());
            const elapsed = this.clock.getElapsedTime();

            // 1. Yumuşak Yay / Isıl Atalet Easing (Anlık Sıçrama Olmadan Organik Geçiş)
            const ease = 1.0 - Math.exp(-dt * 5.2);
            this.smooth.flameRadiusMm += (this.target.flameRadiusMm - this.smooth.flameRadiusMm) * ease;
            this.smooth.dropletRadiusMm += (this.target.dropletRadiusMm - this.smooth.dropletRadiusMm) * ease;
            this.smooth.gravity += (this.target.gravity - this.smooth.gravity) * ease;
            this.smooth.airflow += (this.target.airflow - this.smooth.airflow) * ease;
            this.smooth.soot += (this.target.soot - this.smooth.soot) * ease;
            this.smooth.coolFlame += (this.target.coolFlame - this.smooth.coolFlame) * ease;
            this.smooth.intensity += (this.target.intensity - this.smooth.intensity) * ease;
            this.smooth.tempK += (this.target.tempK - this.smooth.tempK) * ease;

            // D² Damlacık yavaş buharlaşma döngüsü
            if (this.smooth.intensity > 0.15 && this.target.fuelPhase === "droplet") {
                this.dropletLifeRatio -= dt * 0.022;
                if (this.dropletLifeRatio < 0.38) {
                    this.dropletLifeRatio = 1.0; // Sürekli gözlem için yumuşak otomatik besleme
                }
            }

            // Ateşleyici tel animasyonu
            if (this.igniterTimer > 0) {
                this.igniterTimer -= dt;
                this.igniterTip.position.y = -0.28;
                this.igniterMat.color.setHex(0xff7b00);
            } else {
                this.igniterTip.position.y += (-0.95 - this.igniterTip.position.y) * ease;
                this.igniterMat.color.setHex(0x475569);
            }

            // Merkez Yakıt / Brülör Geometrisi Görünürlük & Ölçeği
            const phase = this.target.fuelPhase || "droplet";
            this.dropletMesh.visible = phase === "droplet";
            this.solidSampleMesh.visible = phase === "solid_rod" || phase === "solid";
            if (this.flatSlabGroup) this.flatSlabGroup.visible = phase === "flat_slab";
            if (this.porousBurnerGroup) this.porousBurnerGroup.visible = phase === "porous_sphere";

            const dScale = Math.max(0.12, (this.smooth.dropletRadiusMm / 5.5) * Math.sqrt(this.dropletLifeRatio));
            this.dropletMesh.scale.setScalar(dScale / 0.28);
            const burnerScale = Math.max(0.65, this.smooth.dropletRadiusMm / 1.9);
            if (this.porousBurnerGroup) {
                this.porousBurnerGroup.children[0].scale.setScalar(burnerScale);
            }

            // Alev Katmanları Güncellemesi
            const visualFlameScale = Math.max(0.1, this.smooth.flameRadiusMm / 7.8);
            this.flameLayers.forEach((mesh) => {
                mesh.scale.setScalar(visualFlameScale);
                const u = mesh.material.uniforms;
                u.uTime.value = elapsed;
                u.uGravity.value = this.smooth.gravity;
                u.uAirflow.value = this.smooth.airflow;
                u.uCoolFlame.value = this.smooth.coolFlame;
                u.uIntensity.value = Math.max(0.0, this.smooth.intensity);
                u.uSoot.value = this.smooth.soot;
            });

            // Kamera Bloom Halesi ve Dinamik Alev Işığı
            const haloScale = visualFlameScale * 3.1;
            this.glowSprite.scale.set(haloScale, haloScale * (1.0 + this.smooth.gravity * 0.45), 1.0);
            this.glowSprite.position.y = this.smooth.gravity * 0.35;
            this.glowSpriteMat.opacity = Math.max(0.0, 0.48 * this.smooth.intensity);

            if (this.smooth.coolFlame > 0.5) {
                this.glowSpriteMat.color.setHex(0x9333ea);
                this.flameLight.color.setHex(0xa855f7);
                this.flameLight.intensity = 1.35 * this.smooth.intensity;
            } else if (this.smooth.soot > 0.45) {
                this.glowSpriteMat.color.setHex(0xf59e0b);
                this.flameLight.color.setHex(0xfbbf24);
                this.flameLight.intensity = 2.6 * this.smooth.intensity;
            } else {
                this.glowSpriteMat.color.setHex(0x38bdf8);
                this.flameLight.color.setHex(0x38bdf8);
                this.flameLight.intensity = 2.3 * this.smooth.intensity;
            }

            // Termokupl boncuğu sıcaklığa göre kızarır
            if (this.smooth.tempK > 1300 && this.smooth.intensity > 0.2) {
                this.thermocoupleBeadMat.color.setHex(0xf97316);
            } else if (this.smooth.coolFlame > 0.5) {
                this.thermocoupleBeadMat.color.setHex(0xc084fc);
            } else {
                this.thermocoupleBeadMat.color.setHex(0x64748b);
            }

            // Akış Çizgisi Parçacıkları (-X -> +X Havalandırma ve +Y Kaldırma)
            const posAttr = this.flowParticles.geometry.attributes.position;
            const flowSpeed = 0.25 + (this.smooth.airflow / 10.0) * 1.9;
            const upSpeed = this.smooth.gravity * 1.5;

            for (let i = 0; i < this.particleData.length; i++) {
                const p = this.particleData[i];
                p.x += flowSpeed * dt;
                p.y += upSpeed * dt * Math.exp(-Math.abs(p.x) * 0.6);

                // Alev küresi etrafından aerodinamik sapma
                const rDist = Math.hypot(p.x, p.y, p.z);
                const avoidR = visualFlameScale * 1.05;
                if (rDist < avoidR && rDist > 0.01) {
                    const push = (avoidR - rDist) * dt * 2.5;
                    p.y += (p.y / rDist) * push;
                    p.z += (p.z / rDist) * push;
                }

                if (p.x > 3.4 || p.y > 2.4) {
                    p.x = -3.4;
                    p.y = (Math.random() - 0.5) * 2.8;
                    p.z = (Math.random() - 0.5) * 2.8;
                }
                posAttr.setXYZ(i, p.x, p.y, p.z);
            }
            posAttr.needsUpdate = true;
            this.particleMat.opacity = Math.min(0.75, 0.18 + this.smooth.airflow * 0.02 + this.smooth.gravity * 0.2);

            // Yumuşak Yörünge Kamera Konumlandırma
            const camEase = 1.0 - Math.exp(-dt * 8.0);
            this.camOrbit.theta += (this.camOrbit.targetTheta - this.camOrbit.theta) * camEase;
            this.camOrbit.phi += (this.camOrbit.targetPhi - this.camOrbit.phi) * camEase;
            this.camOrbit.radius += (this.camOrbit.targetRadius - this.camOrbit.radius) * camEase;

            const r = this.camOrbit.radius;
            const sinPhi = Math.sin(this.camOrbit.phi);
            this.camera.position.set(
                r * sinPhi * Math.sin(this.camOrbit.theta),
                r * Math.cos(this.camOrbit.phi) + this.camOrbit.panY,
                r * sinPhi * Math.cos(this.camOrbit.theta)
            );
            this.camera.lookAt(0, 0.15 + this.smooth.gravity * 0.22, 0);

            this.renderer.render(this.scene, this.camera);
        }
    }

    window.Chamber3DEngine = Chamber3DEngine;
})();
