import { useState } from "react";
import { languages } from "../utils/languages";
import "../App.css";
import { useWindowScroll } from "@mantine/hooks";
import {
    Container,
    Autocomplete,
    Textarea,
    Flex,
    Affix,
    Transition,
    Button,
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons";

import { useNavigate } from "react-router-dom";

const NewText = () => {
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("python");
    const [scroll, scrollTo] = useWindowScroll();
    const navigate = useNavigate();

    const handleClick = async (e: any) => {
        e.preventDefault();
        const request = {
            group: "text",
            language: language,
            value: value,
        };
        try {
            const response = await fetch("https://pym.jchun.me/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
            const data = await response.json();
            navigate(`/${data.shortId}`);
        } catch (e: any) {
            console.error(e.message);
        }
    };

    return (
        <Container>
            <Affix position={{ bottom: 30, right: 30 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<IconArrowUp size={16} />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
            <Flex direction="column" gap="lg">
                <Flex direction="row" gap="sm" justify="left" align="flex-end">
                    <Autocomplete
                        sx={{ textAlign: "left", width: "30%" }}
                        label="Pick a language"
                        placeholder="Pick one"
                        data={languages}
                        value={language}
                        onChange={setLanguage}
                    />
                    <Button
                        sx={(theme) => ({
                            backgroundColor: theme.colors.dark[5],
                        })}
                        component="a"
                        href="/api/save"
                        onClick={handleClick}
                    >
                        Save Post
                    </Button>
                </Flex>
                <Textarea
                    placeholder="Paste text here..."
                    autosize
                    minRows={5}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                />
            </Flex>
        </Container>
    );
};

export default NewText;
