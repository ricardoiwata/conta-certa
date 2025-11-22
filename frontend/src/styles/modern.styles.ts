import { StyleSheet } from 'react-native';

export const modernStyles = StyleSheet.create({
  modernCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginVertical: 4,
  },
  
  modernCardContent: {
    padding: 20,
  },
  
  modernTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  
  modernSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 4,
  },
  
  modernValue: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  modernRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  modernColumn: {
    flex: 1,
  },
  
  modernGap: {
    gap: 16,
  },
  
  modernGapSmall: {
    gap: 12,
  },
  
  modernButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  
  modernContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  
  modernHeader: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  
  modernHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 34,
  },
  
  modernHeaderSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
    marginTop: 4,
  },
  
  modernIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
  
  modernBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modernBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  
  balanceCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  
  balanceCardContent: {
    padding: 24,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  balanceValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 42,
    textAlign: 'center',
  },
  
  balanceIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.3,
  },
  
  balanceGradient: {
    flex: 1,
    borderRadius: 20,
    minHeight: 140,
  },
  
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  balanceIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: 'white',
  },
  
  balanceShine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-20deg' }],
  },
});
