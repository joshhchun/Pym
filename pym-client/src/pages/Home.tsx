import { Prism } from "@mantine/prism";
import { Text, Title, Container, Flex, Tabs } from "@mantine/core";
import { IconBrandPython, IconBrandJavascript } from "@tabler/icons";
import { jsMessage, pyMessage } from "../utils/messages";
import "../App.css";

export default function Home() {
    return (
            <Container>
                <Flex direction="column" gap="lg">
                    <Flex
                        direction="row"
                        gap="sm"
                        wrap="wrap"
                        justify="center"
                        align="center"
                    >
                        <Title c="white" fw={700} size={48}>
                            Share
                        </Title>
                        <Title c="white" size={48}>
                            your
                        </Title>
                        <Title c="white" size={48}>
                            content
                        </Title>
                        <Title
                            size={48}
                            c="white"
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        >
                            easily
                        </Title>
                        <Title size={48} c="white">
                            {" "}
                            and{" "}
                        </Title>
                        <Title
                            size={48}
                            c="white"
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        >
                            quickly
                        </Title>
                    </Flex>
                    <Text fz="lg">
                        A syntax-highlighted code/image pastebin and URL
                        shortener that allows you to shrink your content into a
                        tiny URL.
                    </Text>

                    <Tabs variant="outline" defaultValue="Python" mt={50}>
                        <Tabs.List>
                            <Tabs.Tab
                                icon={<IconBrandPython size={14} />}
                                value="Python"
                            >
                                Python
                            </Tabs.Tab>
                            <Tabs.Tab
                                icon={<IconBrandJavascript size={14} />}
                                value="JS"
                            >
                                JavaScript
                            </Tabs.Tab>
                            <Tabs.Tab value="Go">Java</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="Python">
                            <Prism
                                sx={{ textAlign: "left" }}
                                withLineNumbers
                                language="python"
                            >
                                {pyMessage}
                            </Prism>
                        </Tabs.Panel>
                        <Tabs.Panel value="JS">
                            <Prism
                                sx={{ textAlign: "left" }}
                                withLineNumbers
                                language="javascript"
                            >
                                {jsMessage}
                            </Prism>
                        </Tabs.Panel>
                        <Tabs.Panel value="Go">
                            <Prism
                                sx={{ textAlign: "left" }}
                                withLineNumbers
                                language="go"
                            >
                                {pyMessage}
                            </Prism>
                        </Tabs.Panel>
                    </Tabs>
                </Flex>
            </Container>
    );
}
