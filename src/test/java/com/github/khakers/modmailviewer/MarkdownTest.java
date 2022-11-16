package com.github.khakers.modmailviewer;

import org.junit.jupiter.api.Test;

class MarkdownTest {


    @Test
    void MarkdownStyleTest() {
        String s = """
                Italics	*italics* or _italics_
                Underline italics	__*underline italics*__
                
                Bold	**bold**
                Underline bold	__**underline bold**__
                
                Bold Italics	***bold italics***
                underline bold italics	__***underline bold italics***__
                
                Underline	__underline__
                Strikethrough	 ~~Strikethrough~~
                """;
        var rendered= Main.RENDERER.render(Main.PARSER.parse(s));
        System.out.println(rendered);
    }

    @Test
    void testSpoilerRendering() {
        String s = """
                |asf||
                ||Some text inside a spoiler||
                ||Some text inside a spoiler||||spoiler||
                ||asdf|
                |asdf|
                """;
        var rendered= Main.RENDERER.render(Main.PARSER.parse(s));
        System.out.println("Spoiler text:");
        System.out.println(rendered);
    }

    @Test
    void testEmojiRendering() {
        String s = """
                text
                <:java:1041989576920678460>
                text <:java:1041989576920678460> text
                """;
        var rendered= Main.RENDERER.render(Main.PARSER.parse(s));
        System.out.println("Custom Emoji:");
        System.out.println(rendered);
    }

}