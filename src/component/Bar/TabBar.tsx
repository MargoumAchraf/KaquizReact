import React from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Home, CircleUserRound, Users } from 'lucide-react-native';
import { styles } from './style';

interface FooterItemProps {
  icon: typeof Home;
  label: string;
  isActive: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

function FooterItem({ icon: Icon, label, isActive, onPress }: FooterItemProps) {
  const color = isActive ? '#3b82f6' : '#9ca3af'; // blue / grey

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.footerItem}
    >
      <Icon size={26} color={color} strokeWidth={isActive ? 2.4 : 2} />
      <Text
        style={[
          styles.label,
          { color },
          isActive && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function FooterBar() {
  const navigation = useNavigation();

  const currentRouteName = useNavigationState((state) => {
    if (!state) return undefined;
    const route = state.routes[state.index];
    return route?.name;
  });

  const goTo = (routeName: string) => {
    // pushReplacementNamed equivalent — replaces current screen instead of stacking
    navigation.reset({
      index: 0,
      routes: [{ name: routeName as never }],
    });
  };

  return (
    <View style={styles.footer}>
      <FooterItem
        icon={Home}
        label="Home"
        isActive={currentRouteName === 'Home'}
        onPress={() => goTo('Home')}
      />
      <FooterItem
        icon={CircleUserRound}
        label="Profile"
        isActive={currentRouteName === 'Profile'}
        onPress={() => goTo('Profile')}
      />
      <FooterItem
        icon={Users}
        label="Users"
        isActive={currentRouteName === 'Users'}
        onPress={() => goTo('Users')}
      />
    </View>
  );
}
