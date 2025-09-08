import { StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: spacing['2xl'],
        resizeMode: 'contain',
    },
    title: {
        ...typography.title,
        textAlign: 'center',
        marginBottom: spacing['3xl'],
        paddingHorizontal: spacing.lg,
    },
    middle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    actions: {
        width: "100%",
        paddingBottom: spacing['5xl'],
    },
    button: { borderRadius: 10 },
    buttonContent: { paddingVertical: spacing.md },
});
