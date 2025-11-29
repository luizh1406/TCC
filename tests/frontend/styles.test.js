
import styles from '../../src/styles';

describe('Styles Module (Responsividade)', () => {
    
    // --- Caso 1: Dispositivo Desktop (isMobile = false) ---
    describe('Desktop Styles (isMobile = false)', () => {
        const desktopStyles = styles(false);

        test('sidebar: Deve ter largura de 200px para desktop', () => {
            expect(desktopStyles.sidebar.width).toBe("200px");
        });

        test('sidebarItem: Deve ter gap de 10px e paddingLeft de 10px', () => {
            expect(desktopStyles.sidebarItem.gap).toBe("10px");
            expect(desktopStyles.sidebarItem.paddingLeft).toBe("10px");
        });

        test('translucedContainer: Deve ter padding de 20px e gap de 20px', () => {
            expect(desktopStyles.translucedContainer.padding).toBe("20px");
            expect(desktopStyles.translucedContainer.gap).toBe("20px");
        });

        test('translucedBox: Deve ter altura de 60px e padding de 20px', () => {
            expect(desktopStyles.translucedBox.height).toBe("60px");
            expect(desktopStyles.translucedBox.padding).toBe("20px");
        });
        
        test('title: Deve ter fontSize de 24px e padding de 20px', () => {
            expect(desktopStyles.title.fontSize).toBe("24px");
            expect(desktopStyles.title.padding).toBe("20px");
        });
        
        test('th: Deve ter padding de 12px', () => {
            expect(desktopStyles.th.padding).toBe("12px");
        });

        test('td: Deve ter padding de 10px', () => {
            expect(desktopStyles.td.padding).toBe("10px");
        });
    });

    // --- Caso 2: Dispositivo Móvel (isMobile = true) ---
    describe('Mobile Styles (isMobile = true)', () => {
        const mobileStyles = styles(true);

        test('sidebar: Deve ter largura minimizada de 50px para mobile', () => {
            expect(mobileStyles.sidebar.width).toBe("50px");
        });

        test('sidebarItem: Deve ter gap de 0px e paddingLeft de 0px (compacto)', () => {
            expect(mobileStyles.sidebarItem.gap).toBe("0px");
            expect(mobileStyles.sidebarItem.paddingLeft).toBe("0px");
        });

        test('translucedContainer: Deve ter padding de 10px e gap de 10px (compacto)', () => {
            expect(mobileStyles.translucedContainer.padding).toBe("10px");
            expect(mobileStyles.translucedContainer.gap).toBe("10px");
        });

        test('translucedBox: Deve ter altura automática e padding de 10px', () => {
            expect(mobileStyles.translucedBox.height).toBe("auto");
            expect(mobileStyles.translucedBox.padding).toBe("10px");
        });

        test('title: Deve ter fontSize de 18px e padding de 10px', () => {
            expect(mobileStyles.title.fontSize).toBe("18px");
            expect(mobileStyles.title.padding).toBe("10px");
        });

        test('th: Deve ter padding de 8px', () => {
            expect(mobileStyles.th.padding).toBe("8px");
        });

        test('td: Deve ter padding de 8px', () => {
            expect(mobileStyles.td.padding).toBe("8px");
        });
    });

    // --- Caso 3: Teste de Funções (Toggle Switch) ---
    describe('Functional Styles (toggleSwitch/toggleKnob)', () => {
        
        test('toggleSwitch: Deve aplicar a cor verde (#4CAF50) quando isOn é true', () => {
            const onStyle = styles(false).toggleSwitch(true); // isMobile não importa aqui
            expect(onStyle.backgroundColor).toBe("#4CAF50");
        });

        test('toggleSwitch: Deve aplicar a cor cinza (#999) quando isOn é false', () => {
            const offStyle = styles(false).toggleSwitch(false);
            expect(offStyle.backgroundColor).toBe("#999");
        });

        test('toggleKnob: Deve aplicar translateX(25px) quando isOn é true', () => {
            const onStyle = styles(false).toggleKnob(true);
            expect(onStyle.transform).toBe("translateX(25px)");
        });

        test('toggleKnob: Deve aplicar translateX(0) quando isOn é false', () => {
            const offStyle = styles(false).toggleKnob(false);
            expect(offStyle.transform).toBe("translateX(0)");
        });
    });

    // --- Caso 4: Teste de Propriedades Estáticas (Imutáveis) ---
    describe('Static Styles', () => {
        const staticStyles = styles(true); // Usa qualquer estado, pois o estilo deve ser o mesmo

        test('background: Deve ter largura e altura 100vw/100vh', () => {
            expect(staticStyles.background.width).toBe("100vw");
            expect(staticStyles.background.height).toBe("100vh");
        });

        test('header: Deve ter altura de 50px e cor de fundo correta', () => {
            expect(staticStyles.header.height).toBe("50px");
            expect(staticStyles.header.backgroundColor).toBe("#061242");
        });

        test('backgroundImage: Deve conter a URL de fundo correta', () => {
            expect(staticStyles.backgroundImage.backgroundImage).toBe("url('/images/background/model8.png')");
        });
    });
});