import {
    Center,
    Container,
    Text,
    createStyles,
    Header,
    Group,
    Menu,
} from "@mantine/core";

import {
    IconChevronDown,
    IconFile,
    IconAlphabetLatin,
    IconLink,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
    header: {
        height: 56,
        marginBottom: 80,
        [theme.fn.smallerThan(600)]: {
                marginBottom: 40
        }
    },
    inner: {
        height: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colors.dark[0],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colors.dark[4],
        },
    },

    linkLabel: {
        marginRight: 5,
        color: "white",
    },
}));

export default function NavBar() {
    const { classes } = useStyles();

    return (
        <Header
            className={classes.header}
        >
            <Container>
                <div className={classes.inner}>
                    <Group spacing={7}>
                        <Text c="white" fz="xl" component="a" href="/" fw={700}>
                            Pym
                        </Text>
                    </Group>
                    <Group spacing={5}>
                        <Menu trigger="click" exitTransitionDuration={0}>
                            <Menu.Target>
                                <a
                                    href="#1"
                                    className={classes.link}
                                    onClick={(event) => event.preventDefault()}
                                >
                                    <Center>
                                        <span className={classes.linkLabel}>
                                            Create
                                        </span>
                                        <IconChevronDown
                                            size={12}
                                            stroke={1.5}
                                            color="white"
                                        />
                                    </Center>
                                </a>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    icon={<IconFile size={14} color="white" />}
                                    component="a"
                                    href="/newfile"
                                    c="white"
                                >
                                    File
                                </Menu.Item>
                                <Menu.Item
                                    icon={
                                        <IconAlphabetLatin
                                            size={14}
                                            color="white"
                                        />
                                    }
                                    component="a"
                                    href="/newtext"
                                    c="white"
                                >
                                    Paste
                                </Menu.Item>
                                <Menu.Item
                                    icon={<IconLink size={14} color="white" />}
                                    component="a"
                                    href="/newurl"
                                    color="white"
                                >
                                    URL
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </Container>
        </Header>
    );
}
