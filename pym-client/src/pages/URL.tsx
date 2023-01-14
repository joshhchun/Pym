import { useState } from "react";
import { Container, TextInput, Group, Button, Flex } from "@mantine/core";
import { IconClipboardCopy, IconUpload } from "@tabler/icons";

interface Data {
    shortId: string;
}

const URL = () => {
    const [value, setValue] = useState("");
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const handleClick = async (e: any) => {
        e.preventDefault();
        const request = { value, group: "link" };
        try {
            const response = await fetch("https://pym.jchun.me/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
            if (!response.ok) {
                setFailure(true);
                throw new Error(response.statusText);
            }
            const data: Data = await response.json();
            setValue(`https://pym.jchun.me/${data.shortId}`);
            setSuccess(true);
        } catch (e: any) {
            console.log(e.message);
            setFailure(true);
        }
    };

    return (
        <Container>
            <form onSubmit={handleClick}>
                <Flex gap="md" justify="center" align="center">
                    <TextInput
                        sx={{ width: "90%" }}
                        size="lg"
                        value={value}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        placeholder="Paste URL here..."
                        error={
                            failure
                                ? "Error trying to generate a short URL"
                                : ""
                        }
                        disabled={failure}
                        styles={(theme) => ({
                            input: {
                                backgroundColor: success
                                    ? theme.colors.green[9]
                                    : theme.colors.dark[5],
                                borderColor: success
                                    ? theme.colors.green[4]
                                    : "",
                                color: success ? theme.colors.dark[8] : "",
                            },
                        })}
                        rightSection={
                            success ? (
                                <IconClipboardCopy
                                    stroke={1.5}
                                    size={48}
                                    type="submit"
                                    onClick={handleClick}
                                    cursor="pointer"
                                />
                            ) : (
                                <IconUpload
                                    stroke={1.5}
                                    size={32}
                                    type="submit"
                                    onClick={handleClick}
                                />
                            )
                        }
                    />
                </Flex>
            </form>
        </Container>
    );
};

export default URL;
