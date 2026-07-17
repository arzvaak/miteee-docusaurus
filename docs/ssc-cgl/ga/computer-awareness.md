---
title: Computer Awareness
description: A practical SSC CGL lesson on hardware, memory, software, data, office tools, networks, internet protocols, and cyber safety.
tags: [ssc-cgl, general-awareness, computer-awareness, digital-literacy]
review_status: agent-reviewed
content_quality: manually-curated
---

![Concept map for computer-awareness question families](/img/ssc-cgl/computer-awareness-map.svg)
*Classify the keyword as hardware, memory, software, data, network, protocol, or threat before checking the closest trap pair.*

Computer questions test definitions and boundaries. A browser is not a search engine; RAM is not storage; the internet is not the World Wide Web; a Trojan is not a worm. Learn what each term **does** and what it is commonly confused with.

## 1. Trace Input, Processing, Output, and Storage

A computer receives input, processes instructions and data, produces output, and stores data. The CPU includes the arithmetic logic unit (ALU), control unit, and registers. The ALU performs arithmetic and logical operations; the control unit coordinates instruction execution; registers hold very small, immediately needed values.

| Category | Examples | Purpose |
|---|---|---|
| Input | keyboard, mouse, scanner, microphone | enter data or commands |
| Output | monitor, printer, speaker, projector | present processed information |
| Processing | CPU, GPU | execute operations |
| Storage | SSD, hard disk, optical media | retain data |

A touchscreen can be both input and output. A multifunction printer can scan as input and print as output. Classify the specific function named in the question.

**Worked example**

Prompt: “Which CPU component performs comparisons such as greater than or equal to?” Comparisons are logical operations, so the answer is the **ALU**.

**Self-check**

Is a scanner an input or output device?

<details>
<summary>Answer and explanation</summary>

Input. It converts a physical image or document into digital data.
</details>

## 2. Order the Memory Hierarchy

Registers are closest to active CPU execution, followed by cache, main memory, and secondary storage in a simplified hierarchy. Moving downward usually increases capacity and persistence but reduces speed.

| Memory | Volatile? | Main role |
|---|---|---|
| Register | yes | immediate CPU operand/state |
| Cache | yes | frequently used instructions/data near CPU |
| RAM | yes | working memory for running programs |
| ROM/firmware storage | generally non-volatile | startup or device instructions |
| SSD/HDD | non-volatile | long-term secondary storage |

A bit is a binary digit. A byte contains **8 bits**. In strict SI usage, a kilobyte is 1,000 bytes; a kibibyte (KiB) is 1,024 bytes. Older exam material may use “KB” for 1,024 bytes, so read the convention supplied by the question.

**Worked example**

Unsaved work disappears after a power cut because it was held in **volatile RAM**. A saved file on an SSD remains because the SSD is non-volatile storage.

**Self-check**

Which is normally faster and smaller: cache or an SSD?

<details>
<summary>Answer and explanation</summary>

Cache. It sits much closer to the CPU and holds a small working set; an SSD provides much larger persistent storage.
</details>

## 3. Separate System and Application Software

An operating system manages hardware resources, processes, files, memory, and user interaction. A device driver lets the operating system communicate with particular hardware. Utility software performs maintenance or support tasks. Application software helps a user perform a task.

| Software type | Example function | Boundary clue |
|---|---|---|
| Operating system | schedules processes; manages memory/files | platform for applications |
| Driver | controls a device interface | hardware-specific bridge |
| Utility | backup, compression, malware scan | maintenance/support |
| Application | document, browser, media editor | user task |
| Compiler | translates source code into another form before execution | translation stage |
| Interpreter | executes/translates through a runtime | execution is mediated by interpreter/runtime |

Open-source software provides source code under a licence that permits specified use and modification. Freeware is free of price but is not necessarily open source. Copyright, price, and source availability are separate properties.

**Self-check**

Is a device driver application software for writing documents?

<details>
<summary>Answer and explanation</summary>

No. A driver enables the operating system to communicate with hardware.
</details>

## 4. Use Files, Spreadsheets, and Databases Correctly

A file extension suggests a format but does not guarantee content. A folder or directory organises file-system entries. Compression reduces representation size; encryption protects confidentiality using a key. They solve different problems.

In a spreadsheet, a **cell** is identified by column and row, such as B4. A formula usually begins with `=`. A relative reference changes when copied; an absolute reference such as `$A$1` remains fixed. A workbook contains one or more worksheets.

A database stores structured data. A row represents a record and a column represents a field in a simple relational table. A primary key uniquely identifies a row; a foreign key links to a key in another table.

**Worked example**

Formula `=B2*$F$1` is copied down one row. The relative reference becomes `B3`, while `$F$1` stays fixed.

**Self-check**

Which database feature should uniquely identify each student record?

<details>
<summary>Answer and explanation</summary>

A primary key, such as a unique student ID.
</details>

## 5. Understand Networks, Web, and Protocols

A LAN covers a limited local area; a WAN spans a wider area. A router forwards traffic between networks. A switch connects devices within a local network. An IP address identifies an interface for network communication; a MAC address identifies a network interface at the data-link level.

The internet is the global network of networks. The World Wide Web is a service using linked resources over the internet. A browser retrieves and displays web content; a search engine indexes and searches resources.

| Term or protocol | Function |
|---|---|
| URL | address/identifier for a resource |
| DNS | maps domain names to network information such as IP addresses |
| HTTP/HTTPS | transfers web resources; HTTPS adds transport security |
| SMTP | sends/relays email |
| IMAP | synchronises mail while keeping it on the server |
| POP3 | retrieves email, often with simpler local-download behaviour |
| FTP | transfers files |

**Self-check**

Is Google Chrome a browser or a search engine?

<details>
<summary>Answer and explanation</summary>

A browser. A search engine is a web service used through a browser or another client.
</details>

## 6. Recognise Threats and Safe Controls

A virus attaches to a host file or program and spreads when it runs. A worm can self-propagate across systems or networks. A Trojan pretends to be legitimate software. Phishing manipulates a person into revealing information or taking an unsafe action. Ransomware encrypts or blocks access to data and demands payment.

Use layered controls: unique passwords, a password manager, multi-factor authentication, updates, least privilege, verified downloads, offline or isolated backups, and careful link checking. Encryption protects data content; authentication verifies identity; authorisation determines permitted actions.

Digital platforms, payment limits, product names, cyber advisories, and current programme figures can change. Verify date-sensitive claims through the owning institution on the [live current-affairs route](/exams/ssc-cgl/current-affairs).

**Self-check**

Which threat mainly relies on impersonation and deceptive messages?

<details>
<summary>Answer and explanation</summary>

Phishing. It is a social-engineering attack, though it may deliver malware as a second step.
</details>

## 7. Mixed Practice and Mastery

### Question 1

Which CPU unit performs arithmetic and logical operations?

<details>
<summary>Answer and explanation</summary>

The ALU.
</details>

### Question 2

Which working memory is volatile: RAM or SSD storage?

<details>
<summary>Answer and explanation</summary>

RAM. SSD storage is non-volatile.
</details>

### Question 3

What does DNS help resolve?

<details>
<summary>Answer and explanation</summary>

It maps domain names to network information, commonly IP addresses.
</details>

### Question 4

Which protocol is primarily used to send email?

<details>
<summary>Answer and explanation</summary>

SMTP.
</details>

### Question 5

Which malware disguises itself as legitimate software?

<details>
<summary>Answer and explanation</summary>

A Trojan.
</details>

Mastery means you can define the item and reject its nearest neighbour. Continue with [Computer Awareness focused practice](/exams/ssc-cgl/practice/computer-awareness) after you can explain each hardware, memory, software, network, and security boundary without relying on a brand name.
